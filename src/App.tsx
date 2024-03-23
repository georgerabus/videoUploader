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
      setToastShown(false); // Reset toastShown when a new file is uploaded
    }
  };

  useEffect(() => {
    if (file && !toastShown) {
      // Simulate an upload process with a promise
      const uploadPromise = new Promise((resolve, reject) => {
        // Replace the condition below with your actual upload logic
        setTimeout(() => {
          // Simulate upload success after 5 seconds
          resolve('Uploaded: ' + file?.name);
        }, 5000);
      });

      // Displaying toast while the promise is pending
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
      >
        Upload
      </Button>
    </>
  );
}

export default App;
