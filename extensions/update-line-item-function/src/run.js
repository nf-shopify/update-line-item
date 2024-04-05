// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").CartOperation} CartOperation
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const operations = input.cart.lines.reduce(
    /** @param {CartOperation[]} acc */
    (acc, cartLine) => {
      const updateOperation = optionallyBuildUpdateOperation(cartLine);

      if (updateOperation) {
        return [...acc, { update: updateOperation }];
      }

      return acc;
    },
    []
  );

  return operations.length > 0 ? { operations } : NO_CHANGES;
}

/**
 * @param {RunInput['cart']['lines'][number]} cartLine
 */
function optionallyBuildUpdateOperation({
  id: cartLineId,
  locationId,
  merchandise,
}) {
  // OR statement to hardcode locationId for testing purposes
  const location = locationId || 95019991343;
  // Even though locationPrices metafield is specified as JSON in Shopify, it is returned as a string
  // so we need to parse it to JSON
  const locationPrices = JSON.parse(merchandise?.locationPrices?.value) || null;
  if (!locationPrices) {
    return null;
  }

  // Find the price for the location specficed on the cart line
  const newPrice = findLocationPrice(location, locationPrices);
  //console.log(`Location ID: ${location}, Updated Price: ${newPrice}`);

  // Check if the location and price are valid
  const haslocationPrice = location && Number(newPrice) > 0;
  //console.log(`Location ID: ${haslocationPrice}`);

  if (merchandise.__typename === "ProductVariant" && haslocationPrice) {
    return {
      cartLineId,
      price: {
          adjustment: {
            fixedPricePerUnit: {
                amount: Number(newPrice).toFixed(2),
            },
          },
      },
    };
  }

  return null;
}

function findLocationPrice(locationID, locationPrices) {
  for (const locationPrice of locationPrices.locations) {
    if (locationPrice.locationID == locationID) {
      //console.log(`Location Matched: ${locationPrice.locationID}`);
      return locationPrice.price;
    }
  }
}
