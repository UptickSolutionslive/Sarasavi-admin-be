const router = require("express").Router();
const { request } = require("express");
let  User = require("../models/customerModel")



//http://localhost:3000/user/add
router.route("/add").post((req,res)=>{
    // const name = req.body.name;
    const mobileNo = req.body.mobileNo;
    const email = req.body.email;
    const address = req.body.address;
    const cPerson = req.body.cPerson;
    const cMobileNo = req.body.cMobileNo;
    const remark = req.body.remark;
    const creditLimit = req.body.creditLimit;
   

    const newUser = new  User({
        name,
        mobileNo,
        email,
        address,
        cPerson,
        cMobileNo,
        remark,
        creditLimit

    })

    newUser.save().then(()=>{
        res.json("Customer Registered Successfully")
    }).catch((err)=>{
        console.log(err);
    })
})


router.route("/").get((req,res)=>{
    User.find().then((user)=>{
        res.json(user)
    }).catch((err)=>{
        console.log(err)
    })
})

//update
router.route("/update/:id").put(async (req,res)=>{
    let userId = req.params.id;
    const {name,mobileNo,email,address, cPerson,cMobileNo,remark,creditLimit} = req.body;
    const updateUser = {
        name,
        mobileNo,
        email,
        address,
        cPerson,
        cMobileNo,
        remark,
        creditLimit

    }

    const update = await User.findByIdAndUpdate(userId,updateUser).then(()=>{
        res.status(200).send({status: "User Updated"})
    }).catch((err)=>{
        console.log(err);
        res.status(500).send({status: "Error with updating data"});
    })
})

//delete user
router.route("/delete/:id").delete(async (req, res)=>{
    let userId = req.params.id;

    await User.findByIdAndDelete(userId).then(()=>{
        res.status(200).send({status: "User deleted"});
    }).catch((err)=>{
        console.log(err);
    })
})


//get one of the user
//http://localhost:3000/user/get/:id
router.route("/get/:id").get((req,res)=>{
    let id = req.params.id;
    User.findById(id).then((user)=>{
        res.json(user)
    }).catch((err)=>{
        console.log(err);
    })
})


module.exports = router;