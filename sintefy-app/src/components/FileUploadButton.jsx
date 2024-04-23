import React, { useState } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { styled } from '@mui/system';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function FileUploadButton() {
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileSelected(true);
    }
  };

  return (
    <Button
      margin="normal"
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={fileSelected ? <CheckCircleOutlineIcon/> : <CloudUploadIcon />}
    >
      Upload file (pdf/dwg)
      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
    </Button>
  );
}

export default FileUploadButton;
