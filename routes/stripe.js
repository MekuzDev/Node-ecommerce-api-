const router =  require('express').Router()
const Stripe = require('stripe')
const stripe  = Stripe(process.env.STRIPE_KEY)


router.post('/payment',async(req,res)=>{
    const charge = stripe.charge({
        source:req.body.token,
        amount:req.body.amount,
        currency: 'usd',

    },(stripeErr,stripeRes)=>{
        if(stripeErr){
            return res.status(500).json(stripeErr)
        }
        return res.status(200).json()
    })
    
})


module.exports = router;