import { useState } from 'react';
import './App.css';
import { useToast, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Radio, VStack, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';

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
    // Logic to send the video to the backend for processing
    // This is where you would make your API call
    setShowDrawer(false); // Close the drawer after processing
    toast({
      title: 'Video Processing',
      description: 'Your video is being processed. Please wait...',
      status: 'info',
      duration: 5000, // Adjust as needed
      isClosable: true,
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
