import { COLORS } from "@/constants/ui";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type StyledTextInputProps = TextInputProps & {
  isError?: boolean;
};

const StyledTextInput: React.FC<StyledTextInputProps> = ({
  isError,
  style,
  ...props
}) => {
  return (
    <View style={[styles.wrapper, isError ? styles.errorWrapper : null]}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={COLORS.PLACEHOLDER}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.PRIMARY_BACKGROUND,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_BORDER,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  errorWrapper: {
    borderColor: COLORS.PRIMARY_RED,
  },
  input: {
    color: COLORS.PRIMARY_TEXT,
    fontSize: 16,
    padding: 0, // padding переносим в wrapper
  },
});

export default StyledTextInput;
