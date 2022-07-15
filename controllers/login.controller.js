exports.registerUser = (req, res, next) => {
  const {email, senha} = req.body;
  mysql.getConnection((error, conn) => {
      if (error) return res.status(500).send({ error: error})
      conn.query(`SELECT * FROM usuarios WHERE email = ?`, [email], (error, result) => {
        if (error) return res.status(500).send({ error: error})
        if (result.length > 0) {
          res.status(401).send({ mensagem: 'Usuário cadastrado'})
        } else {
          bcrypt.hash(senha, 10, (errorEncrypt, hash) => {
            if (errorEncrypt) return res.status(500).send({ error: errorEncrypt})
              conn.query(
                `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
                [email, hash],
                (error, result) => {
                    conn.release();
                    if (error) return res.status(500).send({ error: error})
                    response = {
                      mensagem: 'Usuário criado com sucesso',
                      usuario: {
                        id_usuario: result.insertId,
                        email
                      }
                    }
                    return res.status(201).send(response);
                }
              )
          });
        }
      });
  });
};

exports.loginUser = (req, res, next) => {
  const { email, senha  } = req.body;
  mysql.getConnection((error, conn) => {
    if (error) return res.status(500).send({ error: error})
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    conn.query(query, [email], (error, results) => {
      conn.release();
      if (error) return res.status(500).send({ error: error})
      if (results.length < 1) {
        return res.status(401).send({ mensagem: 'Falha na autenticação' });
      }
      
      bcrypt.compare(senha, results[0].senha, (err, result) => {
        if (err) return res.status(401).send({ mensagem: 'Falha na autenticação' });
        if (result) {
          const token = jwt.sign({
            id_usuario: results[0].id_usuario,
            email: results[0].email,
          }, 'segredo', {
            expiresIn: "1h"
          });
          return res.status(200).send({ 
            mensagem: 'Autenticado com sucesso',
            token: token})
        };
        return res.status(401).send({ mensagem: 'Falha na autenticação' });
      });
    })
  });
};