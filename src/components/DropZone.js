import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const DropZone = ({
  onUpload,
  acceptedExtensions = ['csv']
}) => {

  const onDrop = useCallback(providedFiles => {
    const acceptedFiles = providedFiles.filter(f => acceptedExtensions.includes(f.name.split('.').pop()));
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        onUpload(reader.result);
      },
      false,
    );

    if (acceptedFiles) {
      reader.readAsText(acceptedFiles[0]);
    }
  }, [acceptedExtensions, onUpload]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })


  return (

    <div className={`DropZone ${isDragActive ? 'is-active': ''}`}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Déposer les fichiers ici</p> :
            <p>Déposer ici un export csv tiré de lore selfie, ou cliquez sur la barre.</p>
        }
      </div>
    </div>
  )
}

export default DropZone;