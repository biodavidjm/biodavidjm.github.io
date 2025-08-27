# David Jimenez-Morales, PhD - Personal Website

A modern, responsive personal website showcasing my academic and professional profile. This website features a clean, professional design optimized for both desktop and mobile devices.

## 🌟 Features

### **Modern Design**
- Responsive layout that works seamlessly on desktop, tablet, and mobile devices
- Clean, professional design with smooth animations and transitions
- Modern CSS with custom properties (variables) for consistent theming
- Optimized typography and spacing for excellent readability

### **Interactive Publications Section**
- **Dynamic Publication Management**: Publications are stored in JSON files for easy maintenance
- **Advanced Filtering**: Filter publications by "Recent (2020+)", "High Impact" (Nature, Science, Cell, Nature journals), or view "All Publications"
- **Dual View Modes**: Toggle between grid view (cards) and list view for peer-reviewed journals
- **Automatic Counting**: Dynamic publication counts for each category
- **Categorized Publications**:
  - Peer-reviewed Journals (35 publications)
  - Books (2 publications)
  - Popular Science Articles (2 publications)
  - Abstracts & Communications (20 publications)
  - PhD Thesis (1 publication)

### **Research Highlights Gallery**
- **Interactive Carousel**: Displays 4 images at a time with navigation arrows
- **Modal View**: Click any image to view it larger in an elegant modal
- **Keyboard Navigation**: Use arrow keys to navigate through images
- **Responsive Design**: Adapts to different screen sizes

### **Comprehensive Sections**
- **About**: Professional summary and current position
- **Research Experience**: Detailed timeline of professional experience
- **Teaching**: Workshop, instructor, and TA roles
- **Computing**: Bioinformatics tools, skills, web development, and software administration
- **Awards**: Recognition and achievements
- **Media & Links**: Professional links and resources
- **Contact**: Professional contact information

### **Technical Features**
- **SEO Optimized**: Meta tags, Open Graph, and Twitter cards
- **Accessibility**: ARIA labels and semantic HTML
- **Performance**: Optimized images and efficient JavaScript
- **GitHub Pages Compatible**: Ready for deployment on GitHub Pages

## 🛠️ Technologies Used

- **HTML5**: Semantic markup for accessibility and SEO
- **CSS3**: Modern styling with flexbox, CSS Grid, and custom properties
- **JavaScript (ES6+)**: Dynamic content loading and interactive features
- **JSON**: Structured data storage for publications
- **Responsive Design**: Mobile-first approach with CSS media queries

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)

### Running Locally

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/biodavidjm/biodavidjm.github.io.git
   cd biodavidjm.github.io
   ```

2. **Start a local development server**:
   ```bash
   python3 -m http.server 8000
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

### Alternative Server Options

If you don't have Python installed, you can use other methods:

**Using Node.js (if you have it installed)**:
```bash
npx http-server
```

**Using PHP (if you have it installed)**:
```bash
php -S localhost:8000
```

## 📝 Content Management

### Adding New Publications

To add new publications, edit the appropriate JSON file in the `data/` directory:

- **Peer-reviewed journals**: Edit `data/journals.json`
- **Books**: Edit `data/books.json`
- **Popular science**: Edit `data/popular-science.json`
- **Abstracts**: Edit `data/abstracts.json`
- **Thesis**: Edit `data/thesis.json`

### JSON Format Examples

**Journal Publication**:
```json
{
  "year": 2024,
  "title": "Publication Title",
  "authors": "Author Names",
  "journal": "Journal Name",
  "link": "https://doi.org/...",
  "highImpact": true,
  "doi": "10.1038/...",
  "notes": "Optional notes"
}
```

**Book**:
```json
{
  "year": 2024,
  "title": "Book Title",
  "authors": "Author Names",
  "publisher": "Publisher Name",
  "link": "https://..."
}
```

### Adding Images to Gallery

1. Add your image to the `images/gallery/` directory
2. Update the gallery section in `index.html` with the new image
3. Include descriptive alt text for accessibility

## 🎨 Customization

### Colors and Styling
The website uses CSS custom properties for easy theming. Edit the `:root` section in `css/modern-style.css` to change colors, fonts, and other design elements.

### Layout Modifications
- **Sections**: Add new sections by following the existing HTML structure
- **Navigation**: Update the navigation menu in `index.html`
- **Footer**: Modify footer links as needed

## 🌐 Deployment

This website is designed to work with GitHub Pages. Simply push your changes to the main branch, and GitHub Pages will automatically deploy your site.


## 📄 License

This project is for personal use. All content and design are the property of David Jimenez-Morales.

---

**David Jimenez-Morales, PhD**  
*Bioinformatics & Systems Biology Researcher*  
[Website](https://biodavidjm.github.io) | [GitHub](https://github.com/biodavidjm) | [LinkedIn](https://linkedin.com/in/davidjm) | [Google Scholar](https://scholar.google.com/citations?user=...)
