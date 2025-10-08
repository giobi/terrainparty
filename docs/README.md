# Documentation Index

Welcome to the Terrain Party documentation! Find the information you need below.

## 📚 Documentation Files

### For Users

**[User Guide](USER_GUIDE.md)** - Complete guide for using Terrain Party
- Getting started
- Using the map interface
- Selecting areas
- Downloading heightmaps
- Importing to Cities Skylines 2
- Tips and tricks

**[FAQ](FAQ.md)** - Frequently Asked Questions
- Common questions and answers
- Troubleshooting
- Technical questions
- Tips for advanced users

### For Developers

**[Architecture](ARCHITECTURE.md)** - Technical documentation
- System architecture
- Technology stack
- Code structure
- API reference
- Performance details
- Development guidelines

**[Serverless Deployment](SERVERLESS_DEPLOYMENT.md)** - Serverless setup guide
- GitHub Pages + Cloudflare Workers
- Migration steps
- Benefits and cost comparison
- Implementation examples
- Deployment checklist

**[Vercel Deployment](VERCEL_DEPLOYMENT.md)** - One-click deployment guide
- Vercel, Netlify, Railway setup
- Quick deploy buttons
- Zero configuration deployment
- Alternative platforms comparison
- Cost analysis

### In Repository Root

**[README.md](../README.md)** - Project overview
- Quick start
- Installation
- Basic usage
- Requirements

**[HEIGHTMAP_FORMAT.md](../HEIGHTMAP_FORMAT.md)** - Heightmap format details
- CS2 specifications
- Technical format details
- Import instructions
- API endpoint documentation

## 🎯 Quick Links

### New Users
Start here: [User Guide](USER_GUIDE.md) → [FAQ](FAQ.md)

### Developers
Start here: [Architecture](ARCHITECTURE.md) → [README.md](../README.md)

### Serverless Deployment
Start here: [Serverless Deployment](SERVERLESS_DEPLOYMENT.md)

### Vercel/Netlify Deployment
Start here: [Vercel Deployment](VERCEL_DEPLOYMENT.md)

## 📖 Reading Order

### For End Users
1. [User Guide](USER_GUIDE.md) - Learn how to use the tool
2. [FAQ](FAQ.md) - Find answers to common questions
3. [HEIGHTMAP_FORMAT.md](../HEIGHTMAP_FORMAT.md) - Understand the output format

### For Developers
1. [README.md](../README.md) - Project overview and setup
2. [Architecture](ARCHITECTURE.md) - Understand the system
3. [Serverless Deployment](SERVERLESS_DEPLOYMENT.md) - Learn about deployment options

### For Contributors
1. [Architecture](ARCHITECTURE.md) - Understand the codebase
2. [README.md](../README.md) - Setup development environment
3. [HEIGHTMAP_FORMAT.md](../HEIGHTMAP_FORMAT.md) - Understand the output

## 🔍 Search by Topic

### Installation & Setup
- [README.md](../README.md) - Basic setup
- [Architecture](ARCHITECTURE.md#deployment) - Advanced deployment

### Using the Application
- [User Guide](USER_GUIDE.md) - Complete usage guide
- [FAQ](FAQ.md#using-terrain-party) - Quick answers

### Technical Details
- [Architecture](ARCHITECTURE.md) - System design
- [HEIGHTMAP_FORMAT.md](../HEIGHTMAP_FORMAT.md) - Format specifications

### Deployment
- [Serverless Deployment](SERVERLESS_DEPLOYMENT.md) - Serverless setup
- [Vercel Deployment](VERCEL_DEPLOYMENT.md) - One-click deployment
- [Architecture](ARCHITECTURE.md#deployment) - Server deployment

### API Usage
- [HEIGHTMAP_FORMAT.md](../HEIGHTMAP_FORMAT.md#api-endpoint) - API documentation
- [Architecture](ARCHITECTURE.md#api-reference) - Detailed API reference

### Troubleshooting
- [FAQ](FAQ.md#troubleshooting) - Common issues
- [User Guide](USER_GUIDE.md#troubleshooting) - Problem solving

## 📝 Document Summaries

### USER_GUIDE.md (6.5 KB)
Complete guide for end users covering:
- Quick start (3 steps)
- Map navigation and controls
- Area selection and download
- CS2 import instructions
- Tips and examples
- Troubleshooting

### FAQ.md (9.5 KB)
Answers to frequently asked questions:
- General questions (20+)
- Usage questions (15+)
- Technical questions (12+)
- Troubleshooting (10+)
- Advanced usage
- Support information

### ARCHITECTURE.md (11.7 KB)
Deep technical documentation:
- System architecture diagrams
- Technology stack details
- Frontend implementation
- Backend design
- Heightmap generation algorithm
- Performance metrics
- API reference
- Code structure

### SERVERLESS_DEPLOYMENT.md (11 KB)
Guide for serverless deployment:
- Architecture comparison
- Benefits of serverless
- Implementation plan
- Cloudflare Worker code
- GitHub Pages setup
- Cost comparison
- Migration checklist
- Testing procedures

## 🎓 Learning Paths

### I want to use Terrain Party
1. Read [Quick Start](USER_GUIDE.md#quick-start) (5 min)
2. Try the application (10 min)
3. Read [FAQ](FAQ.md) if you have questions
4. Import to Cities Skylines 2

### I want to understand how it works
1. Read [README.md](../README.md) overview (5 min)
2. Read [Architecture](ARCHITECTURE.md) (20 min)
3. Review the source code
4. Check [HEIGHTMAP_FORMAT.md](../HEIGHTMAP_FORMAT.md)

### I want to deploy my own instance
1. Read [README.md](../README.md) installation (10 min)
2. Choose deployment method:
   - Server: [Architecture](ARCHITECTURE.md#deployment)
   - Serverless: [Serverless Deployment](SERVERLESS_DEPLOYMENT.md)
3. Follow deployment steps
4. Test with [test-server.js](../test-server.js)

### I want to contribute
1. Read [Architecture](ARCHITECTURE.md) (20 min)
2. Set up development environment ([README.md](../README.md))
3. Review code structure
4. Check existing issues on GitHub
5. Submit pull request

## 📊 Documentation Statistics

- **Total documentation**: ~40 KB
- **Number of files**: 6 (including README)
- **Topics covered**: 100+
- **Code examples**: 20+
- **Diagrams**: 5+

## 🔧 Maintenance

### Updating Documentation

When making changes to the code, please update relevant documentation:
- **New features**: Update User Guide and README
- **API changes**: Update Architecture and HEIGHTMAP_FORMAT
- **Deployment changes**: Update README and Serverless Deployment
- **Bug fixes**: Update FAQ if commonly reported

### Documentation Guidelines

- Use clear, concise language
- Include code examples
- Add diagrams where helpful
- Keep formatting consistent
- Test all code examples
- Update index when adding files

## 🆘 Need Help?

1. **Check documentation**: Use search above
2. **Read FAQ**: [FAQ.md](FAQ.md)
3. **GitHub Issues**: Report bugs or ask questions
4. **Community**: Check GitHub discussions

## 📱 Quick Reference Cards

### User Cheat Sheet
```
Select Area → Click Map → Download → Import to CS2
```

### API Quick Reference
```bash
POST /api/generate-heightmap
Body: {"north":N,"south":S,"east":E,"west":W}
Response: PNG image
```

### Development Setup
```bash
npm install → npm start → npm test
```

## 🌟 Key Features Documented

- ✅ Interactive map interface
- ✅ 12.6km × 12.6km area selection
- ✅ PNG heightmap generation
- ✅ Cities Skylines 2 compatibility
- ✅ Serverless deployment option
- ✅ API for programmatic access
- ✅ Synthetic terrain generation
- ✅ Open source and free

## 📚 External Resources

- [Cities Skylines 2 Documentation](https://skylines.paradoxwikis.com/)
- [Web Mercator Projection](https://en.wikipedia.org/wiki/Web_Mercator_projection)
- [PNG Format Specification](https://www.w3.org/TR/PNG/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [GitHub Pages](https://docs.github.com/en/pages)

---

**Last Updated**: 2024

**Need to add something?** Contributions welcome! Open a pull request.
