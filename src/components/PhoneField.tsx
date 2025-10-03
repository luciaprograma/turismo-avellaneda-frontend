import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneFieldProps {
  label: string;
  countryCode?: string;
  areaCode?: string;
  number?: string;
  onChange: (country: string, area: string, num: string) => void;
}

const PhoneField: React.FC<PhoneFieldProps> = ({
  label,
  countryCode = "",
  areaCode = "",
  number = "",
  onChange,
}) => {
  const [phoneFull, setPhoneFull] = useState<string>(countryCode || "54");
  const [area, setArea] = useState(areaCode);
  const [num, setNum] = useState(number);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sincronizar con props cuando cambian (solo una vez al cargar)
  useEffect(() => {
    if (countryCode) setPhoneFull(countryCode);
    if (areaCode) setArea(areaCode);
    if (number) setNum(number);
    setIsInitialized(true);
  }, []);

  // Actualizar parent solo después de la inicialización
  useEffect(() => {
    if (isInitialized) {
      // Asegurar que siempre tenga el formato +código
      const formattedPhone = phoneFull.startsWith("+")
        ? phoneFull
        : `+${phoneFull}`;
      onChange(formattedPhone, area, num);
    }
  }, [phoneFull, area, num, isInitialized]);

  const handlePhoneChange = (value: string, data: any) => {
    // data.dialCode contiene el código numérico (ej: "54" para Argentina)
    console.log("PhoneInput cambió:", value, "dialCode:", data.dialCode);
    setPhoneFull(data.dialCode);
  };

  return (
    <div>
      <label>{label}:</label>
      <PhoneInput
        country="ar"
        value={phoneFull}
        onChange={handlePhoneChange}
        enableAreaCodes={false}
        disableDropdown={false}
        inputStyle={{ width: "100%" }}
        placeholder="+54"
      />
      <input
        type="text"
        placeholder="Código área (ej: 223)"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      />
      <input
        type="text"
        placeholder="Número (ej: 1234567)"
        value={num}
        onChange={(e) => setNum(e.target.value)}
      />
    </div>
  );
};

export default PhoneField;
