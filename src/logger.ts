import { Category, CategoryServiceFactory, CategoryConfiguration, LogLevel, help, getLogControl, getCategoryControl } from "typescript-logging";
CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info));
export default Category
export const TSLogger: any = {
  help: help,
  getLogControl: getLogControl,
  getCategoryControl: getCategoryControl,
};
