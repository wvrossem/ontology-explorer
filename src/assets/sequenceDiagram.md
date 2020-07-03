sequenceDiagram
  autonumber
  User->>+Atlas: Export Project to XML
  Atlas-->>User: project.xml
  User->>+Explorer: Upload project.xml
  activate Explorer
  loop CreateNetwork
    Explorer->>Explorer: Process project.xml
    Explorer->>Explorer: Create network model
  end
  Note right of Explorer: Stores the network in common state
  Explorer-->>User: Success message
  deactivate Explorer
  activate Explorer
  User->>+Explorer: Select analysis options
  User->>+Explorer: Start analysis
  loop RunAnalysis
    Explorer->>Explorer: Run network analyses
  end
  Note right of Explorer: Runs operations and measures graph library
  Explorer-->>User: Display results table
  deactivate Explorer
  User->>+Explorer: Explore and download results
  activate Explorer
  Explorer-->>User: data.csv
  deactivate Explorer
