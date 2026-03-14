# Server — Cloudinary & Profile Upload Setup

This file explains how to install the Cloudinary dependency, provide credentials, and run the server for local testing of profile uploads.

1. Install dependencies

```bash
cd server
npm install
# add cloudinary client library
npm install cloudinary
```

2. Environment variables

Copy `server/.env.example` to `server/.env` and set the values:

- `CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
- `CLOUDINARY_API_KEY` — your Cloudinary API key
- `CLOUDINARY_API_SECRET` — your Cloudinary API secret
- `MONGO_URI`, `JWT_SECRET`, `PORT`

3. Start the server

```bash
npm run dev
```

4. Notes

- Profile image uploads use `multer` (memory storage) and are uploaded to Cloudinary in the `profiles` folder.
- The route for updating profile is `PUT /api/user/profile` and expects `multipart/form-data` with optional `profileImage` (file) and `bio` (text) fields.
- If you prefer to use `multer-storage-cloudinary` to stream directly to Cloudinary instead of buffering, install it:

```bash
npm install multer-storage-cloudinary
```

I can switch the server to that approach if you want.

5. Quick test using `curl` (replace `<TOKEN>` and file path):

```bash
curl -X PUT "http://localhost:5000/api/user/profile" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "bio=My new bio" \
  -F "profileImage=@/path/to/photo.jpg"
```
