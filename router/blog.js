const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const blogModel = require('../model/blog');
const { convertProcessSignalToExitCode } = require('util');
const commentModel = require('../model/comment');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/upload/`));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});
router.get('/:id', async (req, res) => {

    const blog = await blogModel
        .findById(req.params.id)
        .populate('createdBy');

    if (!blog) {
        return res.status(404).send("Blog not found");
    }

    const comments = await commentModel
        .find({ blogId: req.params.id })
        .populate('createdBy');

    console.log("COMMENTS:");
    console.log(comments);

    return res.render("blog", {
        user: req.user,
        blog: blog,
        comments: comments,
    });
}); 

router.post('/', upload.single('coverImage'), async (req, res) => {
  const { title, body } = req.body;
  const blog = await blogModel.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/upload/${req.file.filename}`
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.post('/comment/:blogId', async (req, res) => {
  const content = req.body.content;
  const comment = await commentModel.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,

  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;