import { COLORS } from "@/constants/ui";
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
  return (
    <TouchableOpacity onPress={onCheck}>
      <Ionicons
        name={checked ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={checked ? COLORS.SUCCESS : COLORS.PRIMARY_BORDER}
      />
    </TouchableOpacity>
  );
};

export default StyledCheckbox;