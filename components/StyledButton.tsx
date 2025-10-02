import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";
import StyledText from "./StyledText";

type StyledButtonProps = TouchableOpacityProps & {
  label?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  size?: "default" | "large" | "small";
  variant?: "primary" | "secondary" | "delete"
};

const StyledButton: React.FC<StyledButtonProps> = ({
  label,
  icon,
  size = "default",
  variant = "primary",
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  const textVariant = (() => {
    if (size === 'large') return 'heading';
    return "small";
  })();
  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor: variant === "secondary" 
            ? theme.colors.SECONDARY_BACKGROUND 
            : variant === "delete"
            ? theme.colors.ERROR_COLOR
            : theme.colors.PRIMARY_ACTIVE_BUTTON,
          borderColor: variant === "secondary" 
            ? theme.colors.PRIMARY_ACTIVE_BUTTON 
            : "transparent",
        },
        disabled ? styles.disabled : null,
        size === "small" ? styles.small : null,
        size === "large" ? styles.large : null,
    ]}
      {...props}
      disabled={disabled}
    >
      {label && (
        <StyledText 
          variant={textVariant}
          style={{ 
            color: variant === "secondary" 
              ? theme.colors.PRIMARY_ACTIVE_BUTTON 
              : "#FFFFFF" 
          }}
        >
          {label}
        </StyledText>
      )}
      {icon && <Ionicons name={icon} size={14} color={variant === "secondary" ? theme.colors.PRIMARY_ACTIVE_BUTTON : "#FFFFFF"} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5
  },
  small: {
    paddingHorizontal: 12,
  },
  large: {
    paddingHorizontal: 30,
  },
});

export default StyledButton;