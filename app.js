const express=require("express")

const machine=express()
const server=machine.listen(3000)
const io = require('socket.io')(server);

var conn=0;
var table={};
var contain=0;
var receiver=0
var extra=0

machine.set('view engine','pug')

machine.use(express.static(__dirname+"/public"))

machine.use(express.json());

machine.post("/shit",(req,res,next)=>{
    if(receiver==0)
    {
    receiver=req.body
    }

})


machine.use("/ball",(req,res,next)=>{
    res.json({prim:receiver,second:extra})
    extra=1;
})

machine.use("/system",(req,res,next)=>{
    if(!(receiver==0))
    {
    res.sendFile(__dirname+"/final.html")
    }
    else
    {
        res.redirect("/")
    }
})

machine.use("/",(req,res,next)=>{
    if(receiver==0)
    {
        res.sendFile(__dirname+"/home.html")
    }
    else
    {
        res.redirect("/system")
    }
})

io.on('connection', function(socket){
    conn++
    io.emit("sad",conn)

    socket.on("pagal",(data)=>{
        receiver=0
        conn=0
        extra=0
        table={}
        contain=0
        io.emit("back","blank")
    })
    
    socket.on("vote",(data)=>{
        var tab=data.main
        var check=data.ind
        var snake= tab.length-1
        for(var j in table){
            contain+=table[j]
        }

       if(check==0)
       {
        contain++
        if(tab[snake] in table)
            {
                table[tab[snake]]++
            }
        if(!(tab[snake] in table))
            {
                table[tab[snake]]=1
            }   
        if(contain==conn)
          {
            io.emit("vote",table)
          }
        contain=0
       }

       else
       {
            if(tab[snake] in table)
            {
                table[tab[snake]]++
                table[tab[snake-1]]--
            }
            if(!(tab[snake]in table))
            {
                table[tab[snake]]=1
                table[tab[snake-1]]--
            }
            if(contain===conn)
            {
                io.emit("vote",table)
            }
           contain=0
       }
    })
  });