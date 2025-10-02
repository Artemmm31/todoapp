import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform } from "react-native";

type DatePickerProps = {
  date: Date | null;
  onChange: (date: Date) => void;
  children: (openPicker: () => void) => React.ReactNode;
};

const DatePicker: React.FC<DatePickerProps> = ({ date, onChange, children }) => {
  const [isIOSPickerOpen, setIsIOSPickerOpen] = useState(false);

  const openPicker = () => {
    if (Platform.OS === "android") {
      const currentDate = date || new Date();
      DateTimePickerAndroid.open({
        value: currentDate,
        onChange: (event, selectedDate) => {
          if (event.type === "set" && selectedDate) {
            DateTimePickerAndroid.open({
              value: selectedDate,
              onChange: (_timeEvent, selectedTime) => {
                if (_timeEvent.type === "set" && selectedTime) {
                  const combinedDate = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes()
                  );
                  onChange(combinedDate);
                }
              },
              mode: "time",
              is24Hour: true,
            });
          }
        },
        mode: "date",
        is24Hour: true,
      });
    } else {
      setIsIOSPickerOpen(true);
    }
  };

  const onIOSChange = (_: any, selectedDate?: Date) => {
    setIsIOSPickerOpen(false);
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <>
      {children(openPicker)}

      {isIOSPickerOpen && Platform.OS === "ios" && (
        <DateTimePicker
          value={date || new Date()}
          mode="datetime"
          display="default"
          onChange={onIOSChange}
        />
      )}
    </>
  );
};

export default DatePicker;
