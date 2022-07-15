const mysql = require('../mysql').pool;

exports.getAllProducts = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      'SELECT * FROM produtos',
      (error, result, field) => {
        if (error) { return res.status(500).send({error: error,data: null})}
        const response = {
          quantidade: result.length,
          produtos: result.map(prod => {
            const { id_produto, nome, preco } = prod;
            return {
              id_produto,
              nome,
              preco,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um produto',
                url: `http://localhost:3001/produtos/${id_produto}`
              }
            }
          })
        }
        return res.status(200).send({response});
      }
    );
  });
};

exports.getOneProduct = (req, res, next) => {
  const { id_produto } = req.params;

  mysql.getConnection((error, conn) => {
    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?',
      [id_produto],
      (error, result, field) => {
        conn.release();
        if (error) {return res.status(500).send({error: error, data: null})}

        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Não foi encontrado produto com esse ID'
          })
        }

        const response = {
          produto: {
            id_produto: result[0].id_produto,
            nome: result[0].nome,
            preco: result[0].preco,
            request: {
              tipo: 'POST',
              descricao: 'Retorna um produto',
              url: `http://localhost:3001/produtos`
            }
          }
        }
        return res.status(200).send(response);
      }
    );
  });
};

exports.postProduct = (req, res, next) => {
  const { nome, preco } = req.body;

  mysql.getConnection((error, conn) => {
      conn.query(
        'INSERT INTO produtos (nome, preco) VALUES (?, ?)',
        [nome, preco],
        (error, result, field) => {
          conn.release();
          if (error) {return res.status(500).send({error: error, data: null})}
          const response = {
            mensagem: 'Produto inserido com sucesso',
            produto: {
              id_produto: result.id_produto,
              nome,
              preco,
              request: {
                tipo: 'GET',
                descricao: 'Retorna todos os produtos',
                url: `http://localhost:3001/produtos`
              }
            }
          }


          return res.status(201).send(response);
        }
      );
  });
};

exports.updateOneProduct = (req, res, next) => {
  const { nome, preco, id_produto } = req.body;
  mysql.getConnection((error, conn) => {
    conn.query(
      'UPDATE produtos SET nome = ?, preco = ? where id_produto = ?',
      [nome, preco, id_produto],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({
            error: error,
            data: null
          })
        }

        if (result.affectedRows <= 0) {
          return res.status(404).send({
            error: 'Id do produto não encontrado!',
            data: null
          })
        }

        const response = {
          mensagem: 'Produto atualizado com sucesso',
          produto: {
            id_produto,
            nome,
            preco,
            request: {
              tipo: 'POST',
              descricao: 'Insere um produtos',
              url: `http://localhost:3001/produtos/${id_produto}`
            }
          }
        }

        res.status(202).send(response);
      }
    );
  });
};

exports.deleteOneProduct = (req, res, next) => {
  const { id_produto } = req.params;
  mysql.getConnection((error, conn) => {
  conn.query(
      'DELETE FROM produtos WHERE id_produto = ?',
      [id_produto],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({error: error, data: null})
        }

        const response = {
          mensagem: 'Produto removido com sucesso',
          request: {
            tipo: 'POST',
            descricao: 'Insere um produto',
            url: `http://localhost:3001/produtos`
          }
        }
        res.status(202).send(response);
      }
    );
  });
};