import JWT, { verify } from 'jsonwebtoken';
import { http } from "@src/storage";
import { User } from '@src/models';

interface ClaimBearer {
  id?: string,
  email?: string,
  sub: 'verify' | 'session',
}

export class UserService {
  private secret: string

  constructor() {
    this.secret = process.env.APP_SECRET ?? "";
  }

  public getSessionClaim(user: User): ClaimBearer {
    return {
      sub: 'session',
      id: user.id,
      email: user.email,
    };
  }

  public generateToken(claim: ClaimBearer) {
    const jwt = JWT.sign(claim, this.secret, {
      expiresIn: claim.sub === 'session' ? '24h' : 60 * 30
    });

    return jwt;
  }

  public verifyToken(token: string, sub = 'session') {
    const message = 'This route need OAuth2 credentials';

    try {
      const decode = <ClaimBearer>verify(token, this.secret);
      let userId = '';

      if (decode && decode.sub === sub)
        userId = decode.id || '';
      else throw http.response.status(401).json({ message });

      return userId;
    } catch {
      throw http.response.status(401).json({ message: "Token live time expire!" });
    }
  }
}