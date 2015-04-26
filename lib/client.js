module.exports = LightblueClient;

function LightblueClient(dataClient, metadataClient) {
  this.data = dataClient;
  this.metadata = metadataClient;
}