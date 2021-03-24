import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { Button, Grid, Label } from "semantic-ui-react";
import { FilePond, registerPlugin } from "react-filepond";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import "./styles.css";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);

export default function ProductImageAndColor({
  product,
  setProduct,
  activeImageAndColor,
  setActiveImageAndColor,
}) {
  const [currColor, setCurrColor] = useState();
  const [currFiles, setCurrFiles] = useState([]);
  const [colsNumber, setColsNumber] = useState(1);

  const addImageAndColorToArray = () => {
    let newProduct = { ...product };
    newProduct.colors.push(currColor);
    currFiles.forEach((image) => {
      newProduct.images.push({
        name: image.name,
        type: image.name.slice(image.name.indexOf(".") + 1),
        color: currColor,
        data: null,
      });
      newProduct.files.push(image);
    });
    console.log(newProduct)
    setProduct(newProduct);
    setActiveImageAndColor(!activeImageAndColor);
  };

  const handleFiles = (filepond) => {
    filepond.length > 0 ? setColsNumber(2) : setColsNumber(1);
    setCurrFiles(filepond.map((file) => file.file));
  };

  return (
    <Grid centered columns={colsNumber}>
      <Grid.Row>
        <Grid.Column>
          <FilePond
            allowFileTypeValidation
            acceptedFileTypes={["image/*"]}
            labelFileTypeNotAllowed="File is not an image."
            fileValidateTypeLabelExpectedTypes={""}
            files={currFiles}
            onupdatefiles={(filepond) => handleFiles(filepond)}
            allowMultiple={true}
            maxFiles={5}
            labelIdle={
              'Upload images <span class="filepond--label-action">here</span>'
            }
          />
        </Grid.Column>
        <Grid.Column floated="right" width={6}>
          {colsNumber === 2 && (
            <>
              <Label
                size="medium"
                style={{
                  borderRadius: 0,
                  color: "white",
                  backgroundColor: "black",
                  textAlign: "center",
                  width: 220,
                }}
              >
                Choose the color of the products
              </Label>
              <br />
              <br />
              <SketchPicker
                disableAlpha
                color={currColor}
                onChange={(color) => setCurrColor(color.hex)}
              />
            </>
          )}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        {currColor && (
          <Button
            onClick={addImageAndColorToArray}
            content="Confirm"
            size="big"
            compact
            style={{
              borderRadius: 0,
              backgroundColor: "Black",
              color: "White",
              width: 220,
            }}
          />
        )}
      </Grid.Row>
    </Grid>
  );
}
