const asyncHandler=(reqHandler)=>{
     return(req,res,next)=>
    {
        Promise.resolve(reqHandler(req,res,next)).
        catch((err)=>next(err))  
    }
}
export { asyncHandler }




//Higher Order function:
////jo k ak func ko as parameter k tor pr leta hai or us ko return krta hai

//try-catch method
/*const asyncHandler=(fn)=>async(req, res, next)=>{
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success:false,
            message:error.message
        })
    
    }

}*/