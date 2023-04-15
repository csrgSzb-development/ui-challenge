export interface TableColumn {
  key: string;
  text: string;
}

export interface TableConfig {
  cols: TableColumn[];
  forbiddenUsername?: string;
  actions: {
    deleteButton: boolean;
    updateButton: boolean;
  }
}
