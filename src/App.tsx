import { useState } from 'react';
import './App.css';
import { useToast, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Radio, VStack, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import axios from 'axios'; // Import Axios for making HTTP requests

function App() {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [sliderValue, setSliderValue] = useState(50); // Initial value for the slider

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowDrawer(true);
    }
  };

  const processVideo = () => {
    const formData = new FormData();
    formData.append('file', file!); // Append the file to the form data
    formData.append('selectedOption', selectedOption); // Append the selected option
    formData.append('sliderValue', String(sliderValue)); // Append the slider value
  
    axios.post('http://localhost:5000', formData)
      .then(response => {
        console.log(response.data); // Log the response from the backend
        setShowDrawer(false);
        toast({
          title: 'Video Processing',
          description: 'Your video is being processed. Please wait...',
          status: response.status === 200 ? 'success' : 'error',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        toast({
          title: 'Error',
          description: 'Failed to process video. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };
  
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
      
      <Drawer
        isOpen={showDrawer}
        placement="right"
        onClose={() => setShowDrawer(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Select an Option</DrawerHeader>

          <DrawerBody>
            <VStack spacing={4}>
              <Radio
                isChecked={selectedOption === 'video'}
                onChange={() => setSelectedOption('video')}
                value="video"
              >
                Video
              </Radio>
              <Radio
                isChecked={selectedOption === 'audio'}
                onChange={() => setSelectedOption('audio')}
                value="audio"
              >
                Audio
              </Radio>
              {selectedOption && (
                <Slider
                  aria-label={`${selectedOption === 'video' ? 'Video' : 'Audio'} Slider`}
                  value={sliderValue}
                  onChange={(value) => setSliderValue(value)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              )}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme="red" mr={3} onClick={processVideo}>
              Process
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default App;
