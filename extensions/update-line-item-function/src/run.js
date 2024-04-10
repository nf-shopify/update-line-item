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
  const location = locationId || 95002984751;
  console.log(`Location ID: ${location}`);

  // Check if the merchandise has locationPrices metafield populated
  if (!merchandise?.locationPrices?.value) {
    return null;
  }
  const locationPrices = JSON.parse(merchandise?.locationPrices?.value);

  // Find the price for the location specficed on the cart line
  const newPrice = findLocationPrice(location, locationPrices);
  //console.log(`Location ID: ${location}, Updated Price: ${newPrice}`);

  // Check if the location and price are valid
  const haslocationPrice = location && Number(newPrice) > 0;
  console.log(`Location ID: ${haslocationPrice}`);

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
  // Use reduce to iterate over the locationPrices
  return locationPrices.locations.reduce((price, locationPrice) => {
    // If the locationID matches the locationID on the cart line, return the price
    return locationPrice.locationID == locationID ? locationPrice.price : price;
  }, []);
}
