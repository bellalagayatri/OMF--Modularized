const cds = require('@sap/cds')
const axios = require('axios')

async function getToken() {

  const creds =
    cds.env.requires.OrderManagementV3.credentials

  const response = await axios.post(
    creds.tokenUrl,
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded'
      },
      auth: {
        username: creds.clientid,
        password: creds.clientsecret
      }
    }
  )

  return response.data.access_token
}

async function getOrder(orderId, token) {

  const creds =
    cds.env.requires.OrderManagementV3.credentials

  return axios.get(
    `${creds.baseUrl}/v3/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

async function patchOrder(
  orderId,
  payload,
  token,
  etag
) {

  const creds =
    cds.env.requires.OrderManagementV3.credentials

  return axios.patch(
    `${creds.baseUrl}/v3/orders/${orderId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'If-Match': etag,
        'Content-Type':
          'application/merge-patch+json'
      }
    }
  )
}

async function patchCustDetails(
  orderId,
  payload,
  token,
  etag
) {

  const creds =
    cds.env.requires.OrderManagementV3.credentials

  /*const payload = {
    action: 'CHANGE_HEADER_DURING_PROCESSING',

    customFields: {
      cakeMessage: description
    }
  }*/

  return axios.patch(
    `${creds.baseUrl}/v3/orders/${orderId}`,
    payload,

    {
      headers: {
        Authorization: `Bearer ${token}`,
        'If-Match': etag,
        'Content-Type':
          'application/merge-patch+json'
      }
    }
  )
}

async function getFulfillmentRequest(
  fulfillmentRequestId,
  token  
) {

  const creds =
    cds.env.requires.OrchestrationAPI.credentials

  return axios.get(
    `${creds.baseUrl}/orchestration/fulfillmentRequests/${fulfillmentRequestId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}


// this is used so that getToken is available in other actions or methods  -- like a public method
module.exports = {
  getToken,
  getOrder,
  patchOrder,
  patchCustDetails,
  getFulfillmentRequest
}