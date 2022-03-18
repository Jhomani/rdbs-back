const connection = {
  name: 'server_connection',
  'x-displayName': 'Connect to Server',
  description: `
  To connect with server you should be send the next Model as second parameter.

  <SchemaDefinition schemaRef="#/components/schemas/users_res" />`
}

const testModel = {
  name: 'test_model',
  'x-displayName': 'Signal Founds',
  description: `
  To recive a socket notification, should be listing the \`found\` event

  The \`data\` parameter is the next Model
  <SchemaDefinition schemaRef="#/components/schemas/users_res" />`
}

export default {
  name: 'Web Socket',
  items: [connection, testModel]
}
