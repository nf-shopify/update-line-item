# Shopify Function Template - Cart Transform Function (app with extensions only)
### Use Case - Product Pricing by Location

This is a template for building a Cart Transform Function that applies dynamic line item pricing based on cart attribute containg the location ID. This app does not include an app home UI.

It contains the basics for building a Shopify app that uses only app extensions. 

(https://shopify.dev/docs/apps/getting-started)

(https://shopify.dev/docs/api/functions/reference/cart-transform)

## Getting started

### Requirements

1. You must [download and install Node.js](https://nodejs.org/en/download/) if you don't already have it.
1. You must [create a Shopify partner account](https://partners.shopify.com/signup) if you don’t have one.
1. You must create a store for testing if you don't have one, either a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or a [Shopify Plus sandbox store](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store).

### Clone the project
```
git clone https://github.com/nf-shopify/update-line-item.git
```
You can find function within extensions/update-line-item-function

### Prerequisites

1. Creation of a json metafield on the varirant object to contain location based pricing - namespace: "custom", key: "location_price"
```
{
  "locations": [
    {
      "locationID": 95020056879,
      "price": "799.99"
    },
    {
      "locationID": 95019991343,
      "price": "699.95"
    },
    {
      "locationID": 95003017519,
      "price": "749.95"
    },
    {
      "locationID": 95002984751,
      "price": "359.95"
    },
    {
      "locationID": 7182195612,
      "price": null
    }
  ]
}
```


### Local Development

[The Shopify CLI](https://shopify.dev/docs/apps/tools/cli) connects to an app in your Partners dashboard. It provides environment variables and runs commands in parallel..

You can develop locally using your preferred package manager. Run one of the following commands from the root of your app.

Using npm:

```shell
npm run dev
```

Open the URL generated in your console. Once you grant permission to the app, you can start to to test the function in your store.


## Developer resources

- [Introduction to Shopify apps](https://shopify.dev/docs/apps/getting-started)
- [App authentication](https://shopify.dev/docs/apps/auth)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [Shopify API Library documentation](https://github.com/Shopify/shopify-api-js#readme)
