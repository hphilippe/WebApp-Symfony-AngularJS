<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use JMS\Serializer\Annotation as Serializer;
use Hateoas\Configuration\Annotation as Hateoas;

/**
 * Post
 *
 * @ORM\Table(name="post", indexes={@ORM\Index(name="fk_attachableItem_User1_idx", columns={"id_User"}), @ORM\Index(name="fk_attachableItem_CategotyPost1_idx", columns={"id_categoryPost"})})
 * @ORM\Entity
 *
 * @Serializer\ExclusionPolicy("all")
 * @Hateoas\Relation("self", href = "expr('/posts/' ~ object.getId())")
 */
class Post
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id_post", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     *
     * @Serializer\Expose()
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=200, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="body", type="text", nullable=true)
     *
     * @Serializer\Expose()
     */
    private $body;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="createdAt", type="datetime", nullable=true)
     *
     * @Serializer\Expose()
     */
    private $createdat;

    /**
     * @var string
     *
     * @ORM\Column(name="pathCoverImage", type="string", length=255, nullable=true)
     *
     * @Serializer\Expose()
     */
    private $pathcoverimage;

    /**
     * @var boolean
     *
     * @ORM\Column(name="published", type="boolean", nullable=true)
     *
     * @Serializer\Expose()
     */
    private $published;

    /**
     * @var \Acme\ApiBundle\Entity\User
     *
     * @ORM\ManyToOne(targetEntity="Acme\ApiBundle\Entity\User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_User", referencedColumnName="id")
     * })
     *
     *
     */
    private $User;

    /**
     * @var \AppBundle\Entity\Categorypost
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Categorypost")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_categoryPost", referencedColumnName="id_categotyPost")
     * })
     *
     *
     */
    private $Categorypost;



    /**
     * Get idPost
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return Post
     */
    public function setTitle($title)
    {
        $this->title = $title;
        $this->createdat = new \DateTime('now');

        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set body
     *
     * @param string $body
     * @return Post
     */
    public function setBody($body)
    {
        $this->body = $body;
        $this->createdat = new \DateTime('now');

        return $this;
    }

    /**
     * Get body
     *
     * @return string 
     */
    public function getBody()
    {
        return $this->body;
    }

    /**
     * Set createdat
     *
     * @param \DateTime $createdat
     * @return Post
     */
    public function setCreatedat($createdat)
    {
        $this->createdat = new \DateTime('now');

        return $this;
    }

    /**
     * Get createdat
     *
     * @return \DateTime 
     */
    public function getCreatedat()
    {
        return $this->createdat;
    }

    /**
     * Set pathcoverimage
     *
     * @param string $pathcoverimage
     * @return Post
     */
    public function setPathcoverimage($pathcoverimage)
    {
        $this->pathcoverimage = $pathcoverimage;
        $this->createdat = new \DateTime('now');

        return $this;
    }

    /**
     * Get pathcoverimage
     *
     * @return string 
     */
    public function getPathcoverimage()
    {
        return $this->pathcoverimage;
    }

    /**
     * Set published
     *
     * @param boolean $published
     * @return Post
     */
    public function setPublished($published)
    {
        $this->published = $published;

        return $this;
    }

    /**
     * Get published
     *
     * @return boolean 
     */
    public function getPublished()
    {
        return $this->published;
    }

    /**
     * Set idUser
     *
     * @param \Acme\ApiBundle\Entity\User $idUser
     * @return Post
     */
    public function setUser(\Acme\ApiBundle\Entity\User $User = null)
    {
        $this->User = $User;

        return $this;
    }

    /**
     * Get idUser
     *
     * @return \Acme\ApiBundle\Entity\User
     */
    public function getUser()
    {
        return $this->User;
    }

    /**
     * Set idCategorypost
     *
     * @param \AppBundle\Entity\Categorypost $idCategorypost
     * @return Post
     */
    public function setCategorypost(\AppBundle\Entity\Categorypost $Categorypost = null)
    {
        $this->Categorypost = $Categorypost;

        return $this;
    }

    /**
     * Get idCategorypost
     *
     * @return \AppBundle\Entity\Categorypost 
     */
    public function getCategorypost()
    {
        return $this->Categorypost;
    }

    /**
     * Get idUser
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getIdUser()
    {
        return null !== $this->User ? $this->User->getId() : null;
    }

    /**
     * Get getUsername
     *
     * @return string
     *
     * @Serializer\VirtualProperty()
     */
    public function getUsername()
    {
        return null !== $this->User ? $this->User->getUsername() : null;
    }

    /**
     * Get getUsername
     *
     * @return string
     *
     * @Serializer\VirtualProperty()
     */
    public function getUserpathimage()
    {
        return null !== $this->User ? $this->User->getPathavatarimg() : null;
    }

    /**
     * Get getIdCategorypost
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getIdCategorypost()
    {
        return null !== $this->Categorypost ? $this->Categorypost->getId() : null;
    }

    /**
     * Get getTitle
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getCategoryTitle()
    {
        return null !== $this->Categorypost ? $this->Categorypost->getTitle() : null;
    }

    /**
     * Get getCategoryUrl
     *
     * @return int|null
     *
     * @Serializer\VirtualProperty()
     */
    public function getCategoryUrl()
    {
        return null !== $this->Categorypost ? $this->Categorypost->getPathcoverimage() : null;
    }
}
