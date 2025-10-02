import { useTheme } from "@/contexts/ThemeContext";
import { StyleSheet, Text, TextProps } from "react-native";

type StyledTextProps = TextProps & {
  variant?: "primary" | "title" | "subTitle" | "heading" | "small";
};

const StyledText: React.FC<StyledTextProps> = ({
  style,
  variant = "primary",
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <Text
      style={[
        { color: theme.colors.PRIMARY_TEXT },
        variant === "title" ? styles.title : null,
        variant === "subTitle" ? styles.subTitle : null,
        variant === "heading" ? styles.heading : null,
        variant === "small" ? styles.small : null,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "300",
  },
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600",
  },
  small: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export default StyledText;