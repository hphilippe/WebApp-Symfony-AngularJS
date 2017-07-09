<?php
// src/Acme/ApiBundle/Entity/User.php

namespace Acme\ApiBundle\Entity;

use FOS\UserBundle\Entity\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;

/**
 * User
 *
 * @ORM\Table("users")
 * @ORM\Entity
 *
 * @Serializer\ExclusionPolicy("all")
 */
class User extends BaseUser
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @Serializer\Expose()
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=150, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="firstName", type="string", length=150, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $firstname;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=255, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="metier", type="string", length=100, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $metier;

    /**
     * @var string
     *
     * @ORM\Column(name="pathAvatarImg", type="string", length=255, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $pathavatarimg;

    /**
     * @var boolean
     *
     * @ORM\Column(name="etatTchat", type="boolean", nullable=true)
     *
     * @Serializer\Expose()
     */
    private $etattchat;


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->idListitem = new \Doctrine\Common\Collections\ArrayCollection();
        parent::__construct();
    }


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return User
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set firstname
     *
     * @param string $firstname
     * @return User
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get firstname
     *
     * @return string
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return User
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set metier
     *
     * @param string $metier
     * @return User
     */
    public function setMetier($metier)
    {
        $this->metier = $metier;

        return $this;
    }

    /**
     * Get metier
     *
     * @return string
     */
    public function getMetier()
    {
        return $this->metier;
    }

    /**
     * Set pathavatarimg
     *
     * @param string $pathavatarimg
     * @return User
     */
    public function setPathavatarimg($pathavatarimg)
    {
        $this->pathavatarimg = $pathavatarimg;

        return $this;
    }

    /**
     * Get pathavatarimg
     *
     * @return string
     */
    public function getPathavatarimg()
    {
        return $this->pathavatarimg;
    }

    /**
     * Set etattchat
     *
     * @param boolean $etattchat
     * @return User
     */
    public function setEtattchat($etattchat)
    {
        $this->etattchat = $etattchat;

        return $this;
    }

    /**
     * Get etattchat
     *
     * @return boolean
     */
    public function getEtattchat()
    {
        return $this->etattchat;
    }

}