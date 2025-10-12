import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (countryCode && countryCode !== null) {
      setCountryCodeStr(String(countryCode));
    }
    if (areaCode !== undefined && areaCode !== null) {
      setArea(String(areaCode));
    } else {
      setArea("");
    }
    if (number && number !== null) {
      setNumStr(String(number));
    } else {
      setNumStr("");
    }
  }, [countryCode, areaCode, number]);

  useEffect(() => {
    const countryNum =
      countryCodeStr && !isNaN(parseInt(countryCodeStr, 10))
        ? parseInt(countryCodeStr, 10)
        : null;

    const areaStr = area.trim();

    const phoneNum =
      numStr && !isNaN(parseInt(numStr, 10)) ? parseInt(numStr, 10) : null;

    onChange(countryNum, areaStr, phoneNum);
  }, [countryCodeStr, area, numStr]);

  const handlePhoneChange = (_value: string, data: any) => {
    setCountryCodeStr(data.dialCode);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setArea(value);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setNumStr(value);
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
