import type View from "@arcgis/core/views/View";
import type Expand from "@arcgis/core/widgets/Expand";
import type Widget from "@arcgis/core/widgets/Widget";

export type UIPosition = Required<
  Pick<__esri.UIAddPosition, "position">
>["position"];

export const uiPositionRe =
  /^(?:(?:manual)|(?:(?:top)|(?:bottom))-(?:(?:left)|(?:right)|(?:leading)|(?:trailing)))$/;

type ExpandProperties = ConstructorParameters<typeof Expand>[0];

/**
 * Determines if the input string is a valid {@link UIPosition}.
 * @param input
 * @returns
 */
export const isValidUIPosition = (input: string): input is UIPosition =>
  uiPositionRe.test(input);

/**
 * Creates a new object and copies the properties of the input object
 * to the new one.
 * @param options - An input object.
 * @returns Returns a new object with the same properties as the input one
 */
function copyObjectProperties<T>(options: T) {
  const currentOptions: Record<PropertyKey, unknown> = {};
  for (const propertyName in options) {
    if (Object.prototype.hasOwnProperty.call(options, propertyName)) {
      const element = options[propertyName];
      currentOptions[propertyName] = element;
    }
  }
  return currentOptions as T;
}

type ViewAddOptions = Parameters<typeof View.prototype.ui.add>[1];

/**
 *
 * Sets up a group of {@link Expand} elements containing the input {@link Widget}.
 * @param view - view
 * @param viewAddOptions - {@link View.prototype.add}
 * @param expandOptions - expandOptions
 * @param widgets - widgets
 * @returns The array of {@link Expand} objects that were created to contain the {@link widgets}.
 * @throws - Throws a {@link TypeError} if {@link widgets} contains no elements or if no group was specified.
 */
export async function setupExpandGroup(
  view: View,
  viewAddOptions: ViewAddOptions,
  expandOptions: ExpandProperties,
  ...widgets: Widget[]
): Promise<Expand[]> {
  // Throw error if no widgets were specified.
  if (widgets.length < 1) {
    throw new TypeError("No widgets were specified.");
  }

  // Import the Expand module.
  const Expand = await import("@arcgis/core/widgets/Expand").then(
    (i) => i.default
  );

  // Create expand options if not already specified.
  if (!expandOptions) {
    expandOptions = {};
  }

  if (!expandOptions.group && viewAddOptions) {
    expandOptions.group =
      typeof viewAddOptions === "string"
        ? viewAddOptions
        : viewAddOptions.position;
  }
  if (!expandOptions.group) {
    throw new TypeError("There was no group specified. Expands will not be grouped");
  }

  // Create an Expand for each of the widgets.
  const expands = widgets.map((widget) => {
    const currentOptions = expandOptions
      ? copyObjectProperties(expandOptions)
      : {};
    currentOptions.content = widget;
    return new Expand(currentOptions);
  });


  // Add the newly-created Expands to the view.
  view.ui.add(expands, viewAddOptions);

  return expands;
}
