export const myProfile = (req,res,next)=>{
    res.status(200).json({
        success:true,
        user:req.user,
    })
}

export const logout = (req, res, next) => {
    console.log("Session before destroying:", req.session);
    req.session.destroy((err) => {
        if (err) return next(err);
        console.log("Session destroyed successfully");
        res.clearCookie("connect.sid");
        res.status(200).json({
            message: "Logged Out",
        });
    });
};
