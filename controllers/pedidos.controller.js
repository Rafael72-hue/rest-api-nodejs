const mysql = require('../mysql').pool;

exports.getOrders = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      `select 
          pe.id_pedidos, 
          pe.quantidade, 
          pe.id_produto, 
          pr.nome, 
          pr.preco 
        from pedidos pe 
        inner join produtos pr 
        on pe.id_produto = pr.id_produto`,
      (error, result, field) => {
        if (error) { return res.send(500).send({error: error}) }
        const response = {
          pedidos: result.map(pedido => {
            console.log(pedido)
            const { id_pedidos, id_produto, quantidade, nome, preco } = pedido;
            return {
              id_pedidos,
              produto: {
                id_produto,
                nome,
                preco
              },
              quantidade,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um pedido',
                url: `http://localhost:3001/pedidos/${id_pedidos}`
              }
            }
          })
        }
        return res.status(200).send(response);
      }
    );
  });
};

exports.getOneOrder = (req, res, next) => {
  const { id_pedidos } = req.params.id_pedidos;

  mysql.getConnection((error, conn) => {
    conn.query(
      'SELECT * FROM pedidos WHERE id_produto = ?',
      [id_pedidos],
      (error, result, field) => {
        conn.release();
        if (error) {return res.status(500).send({error: error, data: null})}

        if (result.length == 0) {
          return res.status(404).send({
            mensagem: 'Não foi encontrado pedido com esse ID'
          })
        }

        const response = {
          pedido: {
            id_produto: result[0].id_produto,
            id_pedidos: result[0].id_pedidos,
            quantidade: result[0].quantidade,
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

exports.postOrder = (req, res, next) => {

  const { quantidade, id_produto } = req.body;

  mysql.getConnection((error, conn) => {
    conn.query(
      'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)',
      [id_produto, quantidade],
      (error, result, field) => {
        conn.release();
        if (error) {return res.status(500).send({error: error, data: null})}
        const response = {
          mensagem: 'pedido criado com sucesso',
          pedido: {
            id_pedidos: result.id_pedidos,
            id_produto,
            quantidade,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os pedidos',
              url: `http://localhost:3001/pedidos`
            }
          }
        }
        return res.status(201).send(response);
      }
    );
  });
};

exports.deleteOrder = (req, res, next) => {
  const { id_pedidos } = req.params;
  mysql.getConnection((error, conn) => {
  conn.query(
      'DELETE FROM pedidos WHERE id_pedidos = ?',
      [id_pedidos],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({error: error, data: null})
        }

        const response = {
          mensagem: 'Pedido removido com sucesso',
          request: {
            tipo: 'POST',
            descricao: 'Insere um pedido',
            url: `http://localhost:3001/pedidos`
          }
        }
        res.status(202).send(response);
      }
    );
  });
};