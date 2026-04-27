# Bantwara Schedule Generator

A modern web application for creating, managing, and printing land property schedules with boundary divisions. Built with Next.js, React, and TypeScript for efficient property documentation and land record management.

## Overview

Bantwara Schedule Generator streamlines the process of documenting land properties, dividing them into parcels, and generating print-ready schedules. It's designed for property administrators, surveyors, and land record offices who need to maintain accurate property divisions and boundary documentation.

## Features

### Core Functionality
- **Land Parcel Management**: Input and manage land properties with complete property identifiers
- **Property Division**: Divide original parcels into up to 3 separate divisions
- **Boundary Documentation**: Define boundary directions (North, South, East, West) for each parcel
- **Metadata Management**: Capture essential property information including:
  - Mauza (village), Thana numbers, Anchal (circle)
  - Police Thana and Revenue Thana information
  - Halka (revenue block), District
  - Raiyat (owner) information
  - Documentation date and Amin (surveyor) name

### Data Management
- **Flexible Sorting**: Sort properties by Khesra (plot number) in ascending or descending order
- **Automatic Calculations**: Real-time total calculations for original and divided parcels
- **Validation**: Automatic verification that division totals match original parcel areas
- **Data Persistence**: State management using Zustand for seamless data handling

### Printing & Export
- **Print Optimization**: Clean print layout with automatic pagination
- **Multiple Paper Sizes**: Support for A4, A3, and Letter formats
- **Orientations**: Both landscape and portrait printing options
- **Pagination**: Automatic row distribution across pages for multi-page documents
- **Print Preview**: WYSIWYG (What You See Is What You Get) interface

### User Interface
- **Responsive Design**: Built with Tailwind CSS for modern, accessible UI
- **Toolbar Controls**: Easy access to print, sort, and data management functions
- **Totals Bar**: Real-time display of calculated totals
- **Regional Language Support**: Devanagari and Yantramanav fonts for South Asian text

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (latest)
- **UI Library**: [React](https://react.dev/) (latest)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.vercel.app/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with PostCSS
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Noto Sans Devanagari, Yantramanav

## Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main application page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── HeaderForm.tsx           # Property metadata form
│   ├── TotalsBar.tsx            # Totals display component
│   ├── Controls/
│   │   └── Toolbar.tsx          # Control toolbar
│   ├── Print/
│   │   ├── PrintFooter.tsx      # Print footer component
│   │   └── PrintPaginatedLayout.tsx  # Pagination logic
│   └── Table/
│       ├── BoundaryInput.tsx    # Boundary data entry
│       └── LandTable.tsx        # Main data table
├── lib/                         # Utility functions
│   ├── types.ts                # TypeScript type definitions
│   ├── calculator.ts           # Area and total calculations
│   ├── sorter.ts               # Sorting utilities
│   ├── printConfig.ts          # Print layout configuration
│   ├── store.ts                # Zustand store
│   └── translator.ts           # Text translation/formatting
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── postcss.config.mjs          # PostCSS configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ or later
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bantwara-schedule-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Usage Guide

### Creating a Schedule

1. **Enter Metadata**: Fill in the header form with property location details:
   - Village (Mauza), Thana information
   - District and administrative divisions
   - Owner and surveyor details
   - Documentation date

2. **Add Parcels**: Enter land parcel information in the table:
   - Jamabandi (register) number
   - Khata (account) number
   - Khesra (plot) number
   - Area measurement

3. **Define Boundaries**: For each parcel, specify:
   - Northern boundary
   - Southern boundary
   - Eastern boundary
   - Western boundary

4. **Create Divisions**: Split parcels into divisions:
   - Up to 3 divisions per parcel
   - Enter division-specific boundaries and areas
   - System validates that totals match original parcel

5. **Review Totals**: Check the totals bar to verify:
   - Original parcel total
   - Division totals for each section
   - Match indicator between original and divisions

6. **Print Schedule**:
   - Select paper size and orientation from toolbar
   - Use print preview to verify layout
   - Print to PDF or physical printer

### Data Sorting

- Use the Sort button in the toolbar to organize properties
- Toggle between ascending and descending order by Khesra number

## Key Components

### Store (Zustand)
Manages application state including:
- Property parcel data
- Division information
- Metadata fields
- Print settings

### Calculator
Provides utility functions for:
- Converting string values to numbers
- Formatting area measurements
- Computing totals for original and divided parcels
- Validating total matches

### Print Configuration
Handles:
- Paper size calculations
- Row height and page layout
- Printable area computation
- Pagination calculations

## Development

### Adding New Features

1. Define types in `lib/types.ts`
2. Create components in `components/` directory
3. Add utilities in `lib/` for business logic
4. Update the store in `lib/store.ts` if needed
5. Style using Tailwind CSS classes

### Code Style

- Use TypeScript for type safety
- Follow React hooks best practices
- Use Zustand for state management
- Apply Tailwind CSS for styling
- Keep components modular and focused

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Client-side rendering optimized for print workflows
- Efficient state management with Zustand
- CSS-in-JS with Tailwind for minimal bundle size
- Lazy loading of print components

## Known Limitations

- Maximum of 3 property divisions per parcel
- Person count limited to 2 or 3 divisions
- Print functionality optimized for standard paper sizes

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues, questions, or suggestions, please contact the development team.

## Version

Current version: 0.1.0

## Changelog

### v0.1.0 (Initial Release)
- Property parcel management
- Division creation and management
- Boundary documentation
- Print scheduling
- Metadata form with location details
- Automatic calculations and validation
- Responsive design for all devices

---

**Last Updated**: April 27, 2026
