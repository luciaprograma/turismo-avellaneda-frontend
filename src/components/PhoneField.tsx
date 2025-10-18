import React, { useState, useEffect, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import styles from "../styles/FormBase.module.css";

interface PhoneFieldProps {
  label: string;
  countryCode?: number | string | null;
  areaCode?: string | null;
  number?: number | string | null;
  onChange: (country: number | null, area: string, num: number | null) => void;
}

const PhoneField: React.FC<PhoneFieldProps> = ({
  label,
  countryCode,
  areaCode,
  number,
  onChange,
}) => {
  const [countryCodeStr, setCountryCodeStr] = useState<string>(() => {
    if (!countryCode || countryCode === null) return "54";
    return String(countryCode);
  });

  const [area, setArea] = useState<string>(() => {
    if (!areaCode || areaCode === null) return "";
    return String(areaCode);
  });

  const [numStr, setNumStr] = useState<string>(() => {
    if (!number || number === null) return "";
    return String(number);
  });

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (countryCode !== undefined && countryCode !== null) {
      setCountryCodeStr(String(countryCode));
    }
    if (areaCode !== undefined) {
      setArea(areaCode !== null ? String(areaCode) : "");
    }
    if (number !== undefined) {
      setNumStr(number !== null ? String(number) : "");
    }
  }, [countryCode, areaCode, number]);

  const handlePhoneChange = (_value: string, data: any) => {
    const newCountryCode = data.dialCode;
    setCountryCodeStr(newCountryCode);

    const countryNum = parseInt(newCountryCode, 10) || null;
    onChange(countryNum, area, numStr ? parseInt(numStr, 10) : null);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setArea(value);

      const countryNum = parseInt(countryCodeStr, 10) || null;
      const phoneNum = numStr ? parseInt(numStr, 10) : null;
      onChange(countryNum, value, phoneNum);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setNumStr(value);

      const countryNum = parseInt(countryCodeStr, 10) || null;
      const phoneNum = value ? parseInt(value, 10) : null;
      onChange(countryNum, area, phoneNum);
    }
  };

  return (
    <div className={styles.phoneFieldContainer}>
      <label className={styles.label}>{label}:</label>

      <div className={styles.phoneInputs}>
        <div className={styles.phoneCountry}>
          <PhoneInput
            country="ar"
            value={countryCodeStr}
            onChange={handlePhoneChange}
            enableAreaCodes={false}
            disableDropdown={false}
            inputStyle={{ width: "100%" }}
            placeholder="54"
          />
        </div>

        <input
          type="text"
          placeholder="Código área (ej: 223 o 0223)"
          value={area}
          onChange={handleAreaChange}
          className={styles.input}
          inputMode="numeric"
          maxLength={10}
        />

        <input
          type="text"
          placeholder="Número (ej: 1234567)"
          value={numStr}
          onChange={handleNumberChange}
          className={styles.input}
          inputMode="numeric"
          maxLength={15}
        />
      </div>
    </div>
  );
};

export default PhoneField;
