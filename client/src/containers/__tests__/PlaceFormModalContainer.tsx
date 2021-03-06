import React from "react";
import { fireEvent, renderWithProviders, wait } from "../../../test/test-utils";
import { createPlace, updatePlace } from "../../actions/placeListActions";
import { PlaceFormModalContainer } from "../PlaceFormModalContainer";

const noop = () => undefined;

describe("PlaceFormModalContainer", () => {
  it("self-closes when cancel button is pressed", () => {
    const onCancel = jest.fn();
    const { getByText } = renderWithProviders(
      <PlaceFormModalContainer open={true} onCancel={onCancel} />
    );

    fireEvent.click(getByText("Cancel"));

    expect(onCancel).toHaveBeenCalled();
  });

  describe("when id is not provided", () => {
    it("dispatches create event when form is submitted", async () => {
      const { store, getByLabelText } = renderWithProviders(
        <PlaceFormModalContainer open={true} onCancel={noop} />
      );

      fireEvent.change(getByLabelText("Restaurant Name"), {
        target: { value: "Place Name Stub" }
      });
      fireEvent.change(getByLabelText("Restaurant Address"), {
        target: { value: "Place Address Stub" }
      });

      fireEvent.submit(getByLabelText("Add Restaurant"));

      await wait(() => {
        expect(store.getActions()).toContainEqual(
          createPlace.request({
            title: "Place Name Stub",
            address: "Place Address Stub"
          })
        );
      });
    });
  });

  describe("when id is provided", () => {
    it("dispatches update event when form is submitted", async () => {
      const { store, getByLabelText } = renderWithProviders(
        <PlaceFormModalContainer open={true} onCancel={noop} id="5" />,
        {
          state: {
            placeEntity: {
              "5": {
                id: "5",
                title: "Place Name Stub",
                address: "Place Address Stub",
                rating: 4
              }
            }
          }
        }
      );

      fireEvent.change(getByLabelText("Restaurant Name"), {
        target: {
          value: "Another Place Name"
        }
      });
      fireEvent.change(getByLabelText("Restaurant Address"), {
        target: {
          value: "Another Place Address"
        }
      });

      fireEvent.submit(getByLabelText("Edit Restaurant"));

      await wait(() => {
        expect(store.getActions()).toContainEqual(
          updatePlace.request({
            place: {
              id: "5",
              title: "Place Name Stub",
              address: "Place Address Stub",
              rating: 4
            },
            data: {
              title: "Another Place Name",
              address: "Another Place Address"
            }
          })
        );
      });
    });
  });
});
