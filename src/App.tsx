import { useState, useEffect } from 'react';
import './App.css';
import { useToast, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Radio, VStack, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import axios from 'axios'; // Import Axios for making HTTP requests

function App() {
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [sliderValue, setSliderValue] = useState(50); // Initial value for the slider
  const [backendData, setBackendData] = useState<{ selectedOption: string; sliderValue: number } | null>(null); // State variable to store backend data
  const [videoProcessed, setVideoProcessed] = useState(false);
  useEffect(() => {
    fetchDataFromBackend();
  }, []); // Fetch data when the component mounts

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
      const processedData = response.data.data;
      setBackendData(processedData);
      setShowDrawer(false);
      setVideoProcessed(true);
      toast({
        title: 'Video Processing',
        description: `Your video "${processedData.filename}" has been processed successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Fetch data from backend after processing the video
      fetchDataFromBackend();
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

  const fetchDataFromBackend = () => {
    axios.get('http://localhost:5000/data', {
        params: {
          selectedOption: selectedOption,
          sliderValue: sliderValue
        }
      })
      .then(response => {
        const data = response.data;
        setBackendData(data);
      })
      .catch(error => {
        console.error('Error fetching data from backend:', error);
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

      {/* Conditional rendering of backend data section */}
      {videoProcessed && backendData && (
  <>
    <Heading my={5} size="md">Backend Data</Heading>
    <Text>Selected Option: {backendData.selectedOption}</Text>
    <Text>Slider Value: {backendData.sliderValue}</Text>
  </>
)}

    </>
  );
}

export default App;
