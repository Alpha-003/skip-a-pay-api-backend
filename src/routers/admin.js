const express = require("express")
const Admin = require("../models/admin")
const auth = require("../middleware/auth")
const router = new express.Router()

// create admin
router.post("/admins", async (req, res) => {
  const admin = new Admin(req.body)

  try {
    await admin.save()

    const token = await admin.generateAuthToken()

    res.status(201).send({ admin, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

// login admin
router.post("/admins/login", async (req, res) => {
  try {
    // make our own method for login
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    )

    const token = await admin.generateAuthToken()

    res.send({ admin, token })
  } catch (e) {
    res.status(400).send()
  }
})

// logout admin
router.post("/admins/logout", auth, async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter(
      (token) => token.token !== req.token
    )

    await req.admin.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// logout admin from all devices
router.post("/admins/logoutAll", auth, async (req, res) => {
  console.log(req.admin)
  try {
    req.admin.tokens = []

    await req.admin.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// get current admin
router.get("/admins/me", auth, async (req, res) => {
  res.send(req.admin)
})

// update the admin
router.patch("/admins/me", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["name", "email", "password"]
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" })
  }

  try {
    // update each property dynamically
    updates.forEach((update) => (req.admin[update] = req.body[update]))
    await req.admin.save()
    res.send(req.admin)
  } catch (e) {
    res.status(400).send(e)
  }
})

// delete the admin
router.delete("/admins/me", auth, async (req, res) => {
  try {
    await req.admin.deleteOne()
    res.status(202).send()
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router