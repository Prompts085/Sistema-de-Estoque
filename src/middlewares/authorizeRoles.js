function autorizarRoles(profiles){
  return (req, res, next) =>{
    if(!profiles.includes(req.user.perfil)) {
      return res.status(401).json({
        error: "Não autorizado"
      })
    }
    next()
  }
}
module.exports = autorizarRoles