import { useState, useEffect } from 'react';
import './App.css';
import { useToast } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';

function App() {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [toastShown, setToastShown] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setToastShown(false);
    }
  };

  useEffect(() => {
    if (file && !toastShown) {
      const formData = new FormData();
      formData.append('file', file);

      const uploadPromise = fetch('http://localhost:5000', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            return response.json(); // Assuming the server returns a JSON response
          } else {
            throw new Error('Failed to upload the video');
          }
        })
        .then(data => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(data);
            }, 0);
          });
        })
        .catch(error => {
          throw new Error('Failed to upload the video');
        });

      toast.promise(uploadPromise, {
        success: { title: 'Upload Successful', description: 'Video uploaded successfully' },
        error: { title: 'Upload Failed', description: 'Failed to upload the video' },
        loading: { title: 'Uploading', description: 'Please wait while the video is being uploaded' },
      });

      setToastShown(true);
    }
  }, [file, toast, toastShown]);

  return (
    <>
      <Heading my={10}>Upload a Video</Heading>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
<Button
  my={5}
  onClick={() => document.getElementById('fileInput')?.click()}
  colorScheme="red" // Set the button color to red
  size="lg" // Set the button size to large
  borderRadius="full" // Make the button fully rounded
  boxShadow="lg" // Add a shadow effect to the button
>
  Upload
</Button>
    </>
  );
}

export default App;
