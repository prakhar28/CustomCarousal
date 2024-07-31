import React, {createContext, useContext, useState} from 'react';

const CarouselContext = createContext();

export const CarouselProvider = ({children}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      name: 'Update Consent',
      key: 'update_consent',
      description: 'Some description',
    },
    {
      name: 'Update Mobile',
      key: 'update_mobile',
      description: 'Some description',
    },
    {
      name: 'Paperless Enroll',
      key: 'paperless_enroll',
      description: 'Some description',
    },
    {
      name: 'Recurring Payment',
      key: 'recurring_payment',
      description: 'Some description',
    },
  ];
  return (
    <CarouselContext.Provider value={{currentStep, setCurrentStep, steps}}>
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = () => useContext(CarouselContext);
