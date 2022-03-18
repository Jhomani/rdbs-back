import axios from 'axios';
import { http } from '@src/storage';

interface UserInfo {
  email: string;
  firstName: string;
  lastName?: string;
  phone: string;
  city: string;
  postalcode: string;
  address: string;
  nationality: string;
  gender?: boolean;
  birthdate: number;
}

export class Hubspot {
  private apikey: string
  private baseuri: string

  constructor() {
    this.apikey = process.env.HUBSPOTKEY + '';
    this.baseuri = "https://api.hubapi.com";
  }

  async getUser(email: string) {
    const uri = `${this.baseuri}/contacts/v1/contact/email/${email}/profile?hapikey=${this.apikey}&property=vid`

    try {
      const { data } = await axios.get(uri);

      return <number>data.vid;
    } catch { }
  }

  async insertUser(profile: UserInfo) {
    const userJson = {
      properties: [
        { property: "email", value: profile.email },
        { property: "firstname", value: profile.firstName },
        { property: "lastname", value: profile.lastName },
        { property: "phone", value: profile.phone },
        { property: "city", value: profile.city },
        { property: "zip", value: profile.postalcode },
        {
          property: "address",
          value: `${profile.address}`
        }
      ]
    };

    const uri = `${this.baseuri}/contacts/v1/contact?hapikey=${this.apikey}`;

    try {
      const { data } = await axios.post(uri, userJson);

      return <number>data.vid;
    } catch {
      throw http.response.status(500).json({
        message: "Error on HubSpot APi"
      });
    }
  }

  async udpateDeal(dealId: number, success = false) {
    const dealJson = {
      properties: [
        {
          value: success ? "closedwon" : "closedlost",
          name: "dealstage"
        }
      ]
    };

    const uri = `${this.baseuri}/deals/v1/deal/${dealId}?hapikey=${this.apikey}`;

    try {
      await axios.put(uri, dealJson);
    } catch {

      throw http.response.status(500).json({
        message: "Error on HubSpot APi"
      });
    }
  }

  async insertDeal(userName: string, vid: number, amount = 0) {
    let titleDeal = `Compra de seguro: ${userName}`;
    const closedate = Date.now();

    const hubspotObject = {
      associations: {
        associatedVids: [vid]
      },
      properties: [
        { value: titleDeal, name: "dealname" },
        { value: "default", name: "pipeline" },
        { value: amount, name: "amount" },
        { value: closedate, name: "closedate" },
        { value: "qualifiedtobuy", name: "dealstage" },
        { value: "newbusiness", name: "dealtype" }
      ]
    };

    const uri = `${this.baseuri}/deals/v1/deal?hapikey=${this.apikey}`;

    try {
      const { data } = await axios.post(uri, hubspotObject);

      return <number>data.dealId;
    } catch {

      throw http.response.status(500).json({
        message: "Error on HubSpot APi"
      });
    }
  }

  async insertNote(dealId: number, profile: UserInfo, buyData?: any) {
    let detalleVenta = "";
    if (buyData) {
      detalleVenta = `<h3 style='text-align: center'>Detalles del pago</h1>
        <ul>
          <li><b>Fecha de pago: ${new Date(
        buyData.transactionDate
      ).toLocaleDateString()}</b> </li>
          <li><b>Id payu de la transacción: ${buyData.payutransactionid
        }</b> </li>
          <li><b>Monto pagado: </b> ${buyData.cost}</li>
        </ul>
        <h3 style='text-align: center'>Plazo comprado</h1>
        <ul>
        <li><b>Plazo: </b> Desde: ${new Date(
          buyData.startDate
        ).toLocaleDateString()} hasta ${new Date(
          buyData.arriveDate
        ).toLocaleDateString()}</li></ul>`;
    }

    const genero = profile.gender ? "Varón" : "Mujer";
    const html =
      `<h3 style='text-align: center'>Datos para la póliza</h1>
      <ul>
        <li><b>Nombre del pagador: </b> ${profile.firstName}</li>
        <li><b>Email: </b> ${profile.email} </li>
        <li><b>Teléfono: </b> ${profile.phone} </li>
        <li><b>Nacimiento: </b> ${new Date(
        profile.birthdate
      ).toLocaleDateString()} </li>
        <li><b>Género: </b> ${genero}</li>
        <li><b>Dirección: </b> ${profile.address}</li>
        <li><b>Código Postal: </b> ${profile.postalcode}</li>
        <li><b>Ciudad: </b> ${profile.city}</li>
        <li><b>Nacionalidad: </b> ${profile.nationality.split("-")[0]}</li>
      </ul>` + detalleVenta;

    const jsonNote = {
      engagement: {
        active: true,
        ownerId: 1,
        type: "NOTE",
        timestamp: Date.now()
      },
      associations: {
        contactIds: [],
        companyIds: [],
        dealIds: [dealId],
        ownerIds: []
      },
      metadata: { body: html }
    };

    const uri = `${this.baseuri}/engagements/v1/engagements?hapikey=${this.apikey}`;

    try {
      await axios.post(uri, jsonNote);
    } catch {
      throw http.response.status(500).json({
        message: "Error on HubSpot APi"
      });
    }
  }
}
