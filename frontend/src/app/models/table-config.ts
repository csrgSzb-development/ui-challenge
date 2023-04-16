export interface TableColumn {
  key: string;
  text: string;
}

export interface TableConfig {
  cols: TableColumn[];
  actions: {
    deleteButton: boolean;
    updateButton: boolean;
  }
}
