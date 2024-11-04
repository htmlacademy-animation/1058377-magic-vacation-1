export const ColorTheme = {
  PURPLE: "purple",
  BLUE: "blue",
  LIGHT_BLUE: "light-blue",
  DARK_PURPLE: "dark-purple"
};

const themeClasses = Object.values(ColorTheme);

export const setTheme = (theme) => {
  themeClasses.forEach(theme => document.body.classList.remove(theme));
  document.body.classList.add(theme);
}
