import StyledText from "@/components/StyledText";
import { COLORS } from "@/constants/ui";
import { getFullFormattedDate } from "@/helpers/date";
import React from "react";
import { StyleSheet, View } from "react-native";

type HeaderProps = {
  totalTodos: number;
  completedTodos: number;
};

const Header: React.FC<HeaderProps> = ({ totalTodos, completedTodos }) => {
  const formattedDateNow = getFullFormattedDate(new Date());
  return (
    <View style={styles.container}>
      <View style={styles.headerMainContent}>
        <StyledText variant="title">Todo app</StyledText>
        <StyledText variant="subTitle">{formattedDateNow}</StyledText>
      </View>
      <StyledText>Completed: {completedTodos} / {totalTodos}</StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: COLORS.SECONDARY_BACKGROUND,
  },
  headerMainContent: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  }
});
export default Header;