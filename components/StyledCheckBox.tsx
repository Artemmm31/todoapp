import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

type StyledCheckboxProps = {
  checked: boolean;
  onCheck: () => void;
};

const StyledCheckbox: React.FC<StyledCheckboxProps> = ({
  checked,
  onCheck,
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity onPress={onCheck}>
      <Ionicons
        name={checked ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={checked ? theme.colors.SUCCESS_COLOR : theme.colors.PRIMARY_BORDER}
      />
    </TouchableOpacity>
  );
};

export default StyledCheckbox;