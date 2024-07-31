import React, {createContext, useContext, useState} from 'react';

const CarouselContext = createContext();

export const CarouselProvider = ({children}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {name: 'Update Consent', key: 'update_consent'},
    {name: 'Update Mobile', key: 'update_mobile'},
    {name: 'Paperless Enroll', key: 'paperless_enroll'},
    {name: 'Recurring Payment', key: 'recurring_payment'},
  ];
  return (
    <CarouselContext.Provider value={{currentStep, setCurrentStep, steps}}>
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = () => useContext(CarouselContext);
