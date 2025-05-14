# RGU Library Card Generator

![RGU Logo](client/src/assets/rgu_logo.png)

A full-stack web application for generating digital library membership cards for Rajiv Gandhi University students. The app allows students to fill in their details, upload a photo, preview their card (with barcode), and download it as a PDF.

---

## Features

- **Digital Library Card Generation**: Fill in personal and academic details to generate a smart card.
- **Photo Upload**: Upload your own photo for the card.
- **Barcode Generation**: Each card includes a unique barcode based on the enrollment number.
- **Live Card Preview**: See a real-time preview of your card, including front and back sides.
- **Fullscreen Preview**: Zoom in on your card for a detailed look.
- **PDF Download**: Download your card as a high-quality PDF, including the barcode and photo.
- **AI Suggestions**: Get course suggestions based on your department (requires OpenAI API key).

---

## Screenshots

### Card Preview (Front)
![Card Preview Front](attached_assets/1.png)

### Card Preview (Back)
![Card Preview Back](attached_assets/2.png)

### Fullscreen Card Preview
![Fullscreen Card](attached_assets/Screenshot 2025-05-15 at 12.23.06 AM.png)

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- (Optional) PostgreSQL database for production

### Installation
```bash
npm install
```

### Running the App (Development)
```bash
npm run dev
```
Visit [http://localhost:4000](http://localhost:4000) in your browser.

### Environment Variables
Create a `.env` file in the root with the following (if using database or AI):
```
DATABASE_URL=your_postgres_db_url
OPENAI_API_KEY=your_openai_api_key
```

---

## Project Structure
- `client/` - React frontend
- `server/` - Express backend
- `shared/` - Shared types and schema
- `attached_assets/` - Images and screenshots for documentation

---

## Customization
- Update the logo in `client/src/assets/rgu_logo.png` as needed.
- Adjust card design in `client/src/components/CardPreview.tsx` and styles in `client/src/index.css`.

---

## License
MIT

---

## Credits
- [JsBarcode](https://github.com/lindell/JsBarcode)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Zod](https://github.com/colinhacks/zod)
- [Framer Motion](https://www.framer.com/motion/)

---

For any issues or contributions, please open an issue or pull request! 