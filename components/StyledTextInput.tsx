import { useTheme } from "@/contexts/ThemeContext";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type StyledTextInputProps = TextInputProps & {
  isError?: boolean;
};

const StyledTextInput: React.FC<StyledTextInputProps> = ({
  isError,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.wrapper, 
      {
        backgroundColor: theme.colors.PRIMARY_BACKGROUND,
        borderColor: isError ? theme.colors.ERROR_COLOR : theme.colors.PRIMARY_BORDER,
      }
    ]}>
      <TextInput
        style={[styles.input, { color: theme.colors.PRIMARY_TEXT }, style]}
        placeholderTextColor={theme.colors.TEXT_SECONDARY}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    padding: 0, 
  },
});

export default StyledTextInput;
