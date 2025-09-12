const { DataTypes } = require('sequelize');

module.exports = (sequelize) => { //exporta o modelo pet
  const Pet = sequelize.define('Pet', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, //gera um id uuid
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { //regras de validacao
        notEmpty: {
          msg: 'O nome do pet é obrigatório'
        },
        len: {
          args: [1, 30],
          msg: 'O nome do pet deve ter entre 1 e 30 caracteres'
        }
      }
    },
    species: {
      type: DataTypes.ENUM('dog', 'cat'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['dog', 'cat']],
          msg: 'A espécie deve ser "dog" ou "cat"'
        }
      }
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'A raça do pet é obrigatória'
        },
        len: {
          args: [3, 30], //o menor possivel é pug
          msg: 'A raça do pet deve ter entre 3 e 30 caracteres'
        }
      }
    },
    age_years: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'A idade não pode ser um número negativo'
        },
        max: {
          args: [20],
          msg: 'A idade deve ser menor que 20 anos'
        }
      }
    },
    shelter_city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'A cidade do abrigo é obrigatória'
        },
        len: {
          args: [1, 100],
          msg: 'A cidade do abrigo deve ter entre 1 e 100 caracteres'
        }
      }
    },
    shelter_lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        min: {
          args: [-90],
          msg: 'A latitude deve estar entre -90 e 90'
        },
        max: {
          args: [90],
          msg: 'A latitude deve estar entre -90 e 90'
        }
      }
    },
    shelter_lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        min: {
          args: [-180],
          msg: 'A longitude deve estar entre -180 e 180'
        },
        max: {
          args: [180],
          msg: 'A longitude deve estar entre -180 e 180'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('available', 'adopted'),
      defaultValue: 'available',
      allowNull: false,
      validate: {
        isIn: {
          args: [['available', 'adopted']],
          msg: 'O status deve ser "available" ou "adopted"'
        }
      }
    }
  }, { //opcoes adicionais do modelo
    tableName: 'pets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    indexes: [ //indices para otimizar as consultas
      {
        fields: ['species']
      },
      {
        fields: ['status']
      },
      {
        fields: ['shelter_city']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  Pet.prototype.isAvailable = function() { //verifica se o pet ta disponivel
    return this.status === 'available';
  };

  Pet.prototype.isAdopted = function() { //verifica se o pet ta adotado
    return this.status === 'adopted';
  };

  Pet.prototype.getLocation = function() { //retorna a localizacao do pet
    return {
      city: this.shelter_city,
      coordinates: {
        lat: parseFloat(this.shelter_lat),
        lng: parseFloat(this.shelter_lng)
      }
    };
  };

  Pet.findAvailable = function() { //busca todos pets disponiveis
    return this.findAll({
      where: { status: 'available' }
    });
  };

  Pet.findBySpecies = function(species) { //busca todos pets de uma especie
    return this.findAll({
      where: { species }
    });
  };

  Pet.findByLocation = function(city) { //busca todos pets de uma cidade
    return this.findAll({
      where: { shelter_city: city }
    });
  };

  return Pet;
};
