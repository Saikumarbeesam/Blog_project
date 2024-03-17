const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "Travel Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    //const count = await Post.count();
    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

 // router.get('', async (req, res) => {
 //   const locals = {
 //  title: "Travel-blog",
  //  description: "Simple Blog created with NodeJs, Express & MongoDb."
//  }

  // try {
   //  const data = await Post.find();
   // res.render('index', { locals, data });
 // } catch (error) {
 //    console.log(error);
  // }

 //});


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});

/**
 * GET /
 * Contact
*/
router.get('/contact', (req, res) => {
  //res.send('This is the contact page.');
  res.render('contact', {
    currentRoute: '/contact'
  });
});



// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Paris, France-The City of Lights",
//       body: "Paris, the enchanting 'City of Lights', captivates with its blend of history, art, and romance. Its cobblestone streets 
//              lead to iconic landmarks like the Eiffel Tower and Notre-Dame."
//     },
//     {
//       title: "London, England-London: The heritage of England",
//       body: "London, the heart of England, stands as a vibrant mosaic of history, culture, and innovation. From the regal Buckingham Palace and the echoing bells of Big Ben to the modern Shard piercing the skyline, the city embodies the nation's heritage."
//     },
//     {
//       title: "Pamukalle, Turkey-Pamukalle-The City of Minerals",
//       body: "Pamukkale, located in Turkey, is often referred to as the 'City of Minerals'. Famous for its terraces of gleaming white calcium deposits, these natural thermal springs look like frozen waterfalls cascading down the mountainside"
//     },
//     {
//       title: "Dubai, UAE- A Megacity That Never Stops Growing",
//       body: "Dubai, a jewel in the UAE's crown, stands as a testament to ambition and innovation. Rising from desert sands, its skyline boasts architectural marvels like the Burj Khalifa, piercing the heavens. Luxury shopping malls coexist with historic souks, offering a blend of tradition and modernity."
//     },
//     {
//       title: "Pyramids of Giza, Egypt",
//       body: "The Pyramids of Giza, standing tall on Egypt's desert plains, are enduring symbols of ancient marvel and mystery. Built as grand tombs for pharaohs, these monumental structures have for millennia captivated imaginations with their scale and precision. The Sphinx, silent guardian of the pyramids, adds to the enigma."
//     },
//     {
//       title: "Maldives, maldives-A Tropical Haven",
//       body: "The Maldives, an archipelago of over a thousand islands, emerges from the Indian Ocean as a tropical haven. Each atoll, with its aquamarine waters and powdery white sands, paints a picture of paradise."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Bangkok, Thailand -Of street food, skyscrapers and unending nights",
//       body: "Bangkok, the pulsating heart of Thailand, is a blend of modernity and tradition. Skyscrapers tower over ancient temples, while the scent of sizzling street food fills bustling alleyways. By night, the city transforms, with markets illuminating streets and rooftop bars offering panoramic city views."
//     },
//     {
//       title: "Prague, Czech-Republic- A Historical and Cultural Excursion",
//       body: "Prague, the heart of the Czech Republic, offers a mesmerizing journey through time. Its cobblestone streets, lined with Gothic and Baroque masterpieces, echo with tales of emperors and artists. "
//     },
//     {
//       title: "Great Barrier Reef, Australia-Nature's Biggest Marvel",
//       body: "The Great Barrier Reef, stretching along Australia's northeast coast, is nature's most magnificent masterpiece. As the   world's largest coral reef system, it boasts a kaleidoscope of marine life and vibrant coral formations"
//     },
//   ])
// }

// insertPostData();


module.exports = router;